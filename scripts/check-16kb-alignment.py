#!/usr/bin/env python3
"""Audit ELF LOAD-segment alignment of the app's native libraries for 16 KB page support.

Android 15+ devices may use 16 KB memory pages, and Play Console warns "Your app could crash
on 16 KB devices" when a shared library's LOAD segments are only 4 KB aligned. Only 64-bit
ABIs matter - 16 KB page devices are arm64/x86_64 only - so 32-bit libs are reported as n/a.

Libraries we compile get aligned by ANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON, injected for every
CMake subproject in android/build.gradle (needs NDK r27+; r28+ does it by default). Prebuilt
.so files that arrive inside third-party AARs - libucrop.so, libpdfium.so, libimagepipeline.so -
are whatever their publisher shipped, so bumping that dependency is the only fix for those.

Usage (after a release build):
  python scripts/check-16kb-alignment.py \
    android/app/build/intermediates/merged_native_libs/release/mergeReleaseNativeLibs/out/lib
"""
import struct
import sys
from pathlib import Path

PT_LOAD = 1
REQUIRED_ALIGN = 16384
ABI_64BIT = {"arm64-v8a", "x86_64"}


def load_alignments(path):
    """Return the p_align of every PT_LOAD segment, or None if not an ELF file."""
    data = path.read_bytes()
    if data[:4] != b"\x7fELF":
        return None
    is64 = data[4] == 2
    end = "<" if data[5] == 1 else ">"

    if is64:
        e_phoff, = struct.unpack_from(end + "Q", data, 0x20)
        e_phentsize, e_phnum = struct.unpack_from(end + "HH", data, 0x36)
        align_off = 0x30
    else:
        e_phoff, = struct.unpack_from(end + "I", data, 0x1C)
        e_phentsize, e_phnum = struct.unpack_from(end + "HH", data, 0x2A)
        align_off = 0x1C

    aligns = []
    for i in range(e_phnum):
        base = e_phoff + i * e_phentsize
        p_type, = struct.unpack_from(end + "I", data, base)
        if p_type != PT_LOAD:
            continue
        p_align, = struct.unpack_from(end + ("Q" if is64 else "I"), data, base + align_off)
        aligns.append(p_align)
    return aligns


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    root = Path(sys.argv[1])
    if not root.is_dir():
        print(f"not a directory: {root}")
        return 2

    failures = []
    checked = 0
    skipped = 0

    for so in sorted(root.rglob("*.so")):
        aligns = load_alignments(so)
        if not aligns:
            continue
        rel = so.relative_to(root)
        abi = rel.parts[0] if len(rel.parts) > 1 else ""
        if abi not in ABI_64BIT:
            skipped += 1
            continue
        checked += 1
        worst = min(aligns)
        if worst < REQUIRED_ALIGN:
            failures.append((worst, str(rel)))

    print(f"{checked} 64-bit libraries checked ({skipped} 32-bit skipped, not affected)")
    if failures:
        print(f"{len(failures)} NOT 16 KB aligned:\n")
        for worst, rel in sorted(failures):
            print(f"  FAIL align={worst} ({hex(worst)})  {rel}")
        return 1

    print("all 64-bit LOAD segments are aligned to >= 16384 - OK for 16 KB devices")
    return 0


if __name__ == "__main__":
    sys.exit(main())
