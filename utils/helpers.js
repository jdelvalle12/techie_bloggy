module.exports = {
    format_date: (dateStr) => {
      // Format date as MM/DD/YYYY
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    format_time: (date) => {
      return time = date.toLocaleDateString('en-US');
    },
  };
  