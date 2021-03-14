module.exports = p => {
  let query = {};
  if (p.maxVotes)
    query.attentionUnits = { $lte: p.maxVotes };
  if (p.tag !== undefined) query.tag = p.tag;
  else if (p.id !== undefined) query._id = p.id;
  else if (p.username !== undefined) query.username = p.username;
  else query = {};
  return p.Type.find(query)
    .sort({ attentionUnits: '-1' })
    .limit(20)
    .exec();
};