// API route: http://localhost:3000/api/task

import Tasks from '../../../models/task'
import { Request, Response } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'

export default async (req: Request, res: Response) => {
  const { method } = req

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

  // Create Task
  if (method === 'POST') {
    try {
      const newTask = await new Tasks(req.body).save()
      res.status(201).json({ data: newTask, msg: 'Task added successfully' })
    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error' })
      console.log(error)
    }
  }

  // Get all tasks
  if (method === 'GET') {
    try {
      const tasks = await Tasks.find()
      res.status(200).json({ data: tasks })
    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error' })
      console.log(error)
    }
  }
}
