const json = (req) => {
  try {
    return JSON.parse(req.body);
  } catch (e) {
    return {};
  }
};

module.exports = json;
