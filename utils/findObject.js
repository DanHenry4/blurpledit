module.exports = p => {
  let query;
  if (p.tag !== undefined) query = { tag: p.tag };
  else if (p.id !== undefined) query = { _id: p.id };
  else query = {};
  return p.Type.find(query).sort({ votes: '-1' }).exec();
};