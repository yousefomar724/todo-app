import mongoose, { ConnectOptions } from 'mongoose'

declare global {
  var mongoose: any
}

const DB_URL = `${process.env.DB_URL!}`

if (!DB_URL)
  throw new Error(
    'please define the DB_URL environment variable inside .env.local'
  )

let cashed = global.mongoose

if (!cashed) cashed = global.mongoose = { conn: null, promise: null }

const dbConnect = async () => {
  if (cashed.conn) return cashed.conn

  if (cashed.promise) {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions

    cashed.promise = mongoose.connect(DB_URL, options).then((mongoose) => {
      return mongoose
    })
  }

  cashed.conn = await cashed.promise
  return cashed.conn
}

export default dbConnect
