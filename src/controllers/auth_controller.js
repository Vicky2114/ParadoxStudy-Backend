const start = async (req, res) => {
  try {
    res.status(200).send({ message: "server working fine" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "internal server error" });
  }
};

module.exports = {
  start,
};
