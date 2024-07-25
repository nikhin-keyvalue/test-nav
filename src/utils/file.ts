export const getFileNameWithExt = (response: Response) => {
  try {
    let filename = '';
    const disposition = response.headers.get('content-disposition');

    if (disposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    return filename;
  } catch (e) {
    return '';
  }
};
