module.exports = {
    format_date: (dateStr) => {
      // Format date as MM/DD/YYYY
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
  };
  