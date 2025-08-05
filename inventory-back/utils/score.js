exports.scoreItem = (prompt, item, keywords) => {
  let score = 0;

  const fields = [
    item.name?.toLowerCase(),
    item.category?.toLowerCase(),
    item.status?.toLowerCase(),
  ];

  for (const keyword of keywords) {
    for (const field of fields) {
      if (field && field.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
  }

  if (prompt) {
    for (const field of fields) {
      if (field && field.includes(prompt.toLowerCase())) {
        score += 3;
      }
    }
  }

  return score;
};
