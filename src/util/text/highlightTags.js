const highlightTags = (text) => {
  if (typeof text !== 'string') {
    return text;
  }

  const tagRegex = /#(\w+)/g;

  return text.split(tagRegex).map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className="text-blue-500 font-semibold">
          #{part}
        </span>
      );
    }
    return part;
  });
};

export default highlightTags;