import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import { getUserId } from '../../../redux/store/getState';
import { submitFeedback } from '../../../utils/apicalls/feedbackHandler';
import { colors } from '../../../global/theme';

const SIDEBAR = {
  bg: '#F5F3EF',
  cardBg: '#FFFFFF',
  accent: '#D48A4A',
  text: '#1B1B1B',
  textMuted: '#6B6B6B',
};

export default function FeedbackScreen() {
  const navigation = useNavigation();
  const [feedbackText, setFeedbackText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const pickPdf = useCallback(async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory',
      });
      const picked = result?.[0] ?? result;
      if (picked) {
        const uri = picked.fileCopyUri || picked.uri;
        const name = picked.name ?? picked.fileName ?? 'document.pdf';
        if (uri) setPdfFile({ uri, name });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) return;
      Alert.alert('Error', 'Could not pick file: ' + (err?.message ?? 'Unknown error'));
    }
  }, []);

  const removePdf = useCallback(() => setPdfFile(null), []);

  const handleSubmit = useCallback(async () => {
    const text = (feedbackText || '').trim();
    if (!text) {
      Alert.alert('Required', 'Please enter your feedback.');
      return;
    }
    const userId = getUserId();
    if (!userId) {
      Alert.alert('Error', 'Please sign in to submit feedback.');
      return;
    }
    setSubmitting(true);
    setUploadPercent(0);
    try {
      await submitFeedback(userId, text, pdfFile, {
        onUploadProgress: (p) => setUploadPercent(p),
      });
      Alert.alert('Success', 'Thank you! Your feedback has been submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      setFeedbackText('');
      setPdfFile(null);
    } catch (err) {
      const msg = err?.data?.description ?? err?.data?.message ?? err?.message ?? 'Failed to submit feedback.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
      setUploadPercent(0);
    }
  }, [feedbackText, pdfFile, navigation]);

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <Icon name="arrow-back" size={26} color={SIDEBAR.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Feedback</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Your feedback</Text>
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts, suggestions, or report issues..."
          placeholderTextColor={SIDEBAR.textMuted}
          value={feedbackText}
          onChangeText={setFeedbackText}
          multiline
          numberOfLines={6}
          maxLength={5000}
          editable={!submitting}
        />
        <Text style={styles.charCount}>{feedbackText.length} / 5000</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>Attach PDF (optional)</Text>
        <View style={styles.pdfRow}>
          <Pressable
            style={[styles.pdfBtn, submitting && styles.pdfBtnDisabled]}
            onPress={pickPdf}
            disabled={submitting}
          >
            <Icon name="attach-file" size={22} color="#fff" />
            <Text style={styles.pdfBtnText}>Choose PDF</Text>
          </Pressable>
          {pdfFile ? (
            <View style={styles.pdfInfo}>
              <Text style={styles.pdfName} numberOfLines={1}>
                {pdfFile.name}
              </Text>
              <Pressable onPress={removePdf} hitSlop={8}>
                <Icon name="close" size={20} color={SIDEBAR.accent} />
              </Pressable>
            </View>
          ) : null}
        </View>

        {submitting && uploadPercent > 0 && (
          <View style={styles.progressWrap}>
            <Text style={styles.progressText}>Uploading... {uploadPercent}%</Text>
          </View>
        )}

        <Pressable
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Feedback</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: SIDEBAR.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    backgroundColor: SIDEBAR.cardBg,
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: SIDEBAR.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: SIDEBAR.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: SIDEBAR.cardBg,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: SIDEBAR.text,
    minHeight: 140,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  charCount: {
    fontSize: 12,
    color: SIDEBAR.textMuted,
    marginTop: 6,
  },
  pdfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SIDEBAR.accent,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  pdfBtnDisabled: {
    opacity: 0.6,
  },
  pdfBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  pdfInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 8,
  },
  pdfName: {
    flex: 1,
    fontSize: 14,
    color: SIDEBAR.text,
  },
  progressWrap: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 13,
    color: SIDEBAR.textMuted,
  },
  submitBtn: {
    marginTop: 28,
    backgroundColor: SIDEBAR.accent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
