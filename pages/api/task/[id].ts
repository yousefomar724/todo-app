// API route: http://localhost:3000/api/[taskId]

import Tasks from '../../../models/task'
import { Request, Response } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'

export default async (req: Request, res: Response) => {
  const {
    method,
    query: { id },
  } = req

  // Connect to DB
  try {
    await mongoose
      .connect(`${process.env.DB_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
      .then(() => console.log('Database connected!'))
      .catch((err: any) => console.log(err))
  } catch (error) {
    console.log(error)
  }

  // Update Task
  if (method === 'PUT') {
    try {
      const result = await Tasks.findByIdAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
      )
      res.status(200).json({ data: result, msg: 'Task Updated Successfully' })
    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error' })
      console.log(error)
    }
  }

  // Delete Task
  if (method === 'DELETE') {
    try {
      await Tasks.findByIdAndDelete(id)
      res.status(200).json({ msg: 'Task Deleted Successfully' })
    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error' })
      console.log(error)
    }
  }
}
