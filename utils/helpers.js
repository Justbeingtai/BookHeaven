
module.exports = {
  // Example helper function: Formats dates nicely for use in Handlebars
  format_date: (date) => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
  },
  
  // Example helper function: Truncate long text to a set length
  truncate_text: (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  }
};
