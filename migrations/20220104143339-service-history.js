const COLLECTIONS = [
  'maintenance-histories',
  'refueling-histories',
  'wash-histories',
]

module.exports = {
  async up(db, client) {
    for (const collection of COLLECTIONS) {
      const records = await db.collection(collection).find().toArray()
      for (const { user, _id } of records) {
        if (!user) continue
        const car = await db.collection('cars').findOne({ user })
        if (car?._id) {
          await db.collection(collection).updateOne(
            { _id },
            {
              $unset: { user: '' },
              $set: { car: car._id },
            },
          )
        } else {
          await db.collection(collection).deleteOne({ _id })
        }
      }
    }
  },

  async down(db, client) {
    for (const collection of COLLECTIONS) {
      await db
        .collection(collection)
        .updateMany({}, { $unset: { quantity: null } })
    }
  },
}
