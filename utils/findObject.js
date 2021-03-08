module.exports = ({Type, id = undefined, tag = undefined}={}) => {
  return (req, res, next, value) => {
    Type.find(() => {
      return { tag: tag } || { _id: id } || '*';
    }).sort({
      votes: '-1'
    }).exec((err, data) => {
      if (err) throw err;

      if (data.length) {
        res.json(data);
      } else {
        res.status(404);
        res.json({ 
          error: `Unable to find ${type} with id ${id}` 
        });
      }
    });
  };
};