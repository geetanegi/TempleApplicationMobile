import { API } from '../endpoints';
import { uploadApi } from './index';

/**
 * Submit feedback with optional PDF attachment.
 * @param {number|string} userId
 * @param {string} feedbackText
 * @param {object|null} pdfFile - DocumentPicker result: { uri, name, type } or null
 * @param {{ onUploadProgress?: (percent: number) => void }} options
 */
export const submitFeedback = async (userId, feedbackText, pdfFile, options = {}) => {
  const formData = new FormData();
  formData.append('userId', String(userId));
  formData.append('feedbackText', (feedbackText || '').trim());
  if (pdfFile && pdfFile.uri) {
    const filename = pdfFile.name || pdfFile.fileName || 'document.pdf';
    formData.append('pdf', {
      uri: pdfFile.uri,
      type: 'application/pdf',
      name: filename.endsWith('.pdf') ? filename : filename + '.pdf',
    });
  }
  const uploadOptions = {};
  if (options.onUploadProgress) {
    uploadOptions.onUploadProgress = (e) => {
      const percent = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
      options.onUploadProgress(percent);
    };
  }
  return uploadApi(API.FEEDBACK_SUBMIT(), formData, uploadOptions);
};
