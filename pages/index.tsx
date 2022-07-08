import Head from 'next/head'
import { SyntheticEvent, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://todo-app-steel-sigma.vercel.app/api/task'

export const getServerSideProps = async () => {
  const { data } = await axios.get(API_URL)
  return {
    props: {
      tasks: data.data,
    },
  }
}

interface Task {
  task: string
  _id?: string
  completed?: boolean
}

const Home = (props: { tasks: Task[] }) => {
  const [tasks, setTasks] = useState<Task[]>(props.tasks)
  const [task, setTask] = useState<Task>({ task: '' })

  const handleChange = ({
    currentTarget: input,
  }: {
    currentTarget: { value: string }
  }) => {
    input.value === ''
      ? setTask({ task: '' })
      : setTask((prev) => ({ ...prev, task: input.value }))
  }

  const editTask = (id: string) => {
    const currentTask = tasks.filter((task) => task._id === id)
    setTask(currentTask[0])
  }

  const addTask = async (e: SyntheticEvent) => {
    e.preventDefault()
    try {
      if (task._id) {
        const { data } = await axios.put(API_URL + '/' + task._id, {
          task: task.task,
        })
        const originalTasks = [...tasks]
        const index = originalTasks.findIndex((t) => t._id === task._id)
        originalTasks[index] = data.data
        setTasks(originalTasks)
        setTask({ task: '' })
      } else {
        const { data } = await axios.post(API_URL, task)
        setTasks((prev) => [...prev, data.data])
        setTask({ task: '' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateTask = async (id: string) => {
    try {
      const originalTasks = [...tasks]
      const index = originalTasks.findIndex((t) => t._id === id)
      const { data } = await axios.put(API_URL + '/' + id, {
        completed: !originalTasks[index].completed,
      })
      originalTasks[index] = data.data
      setTasks(originalTasks)
      console.log(data.msg)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async (id: string | number) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${id}`)
      setTasks((prev) => prev.filter((task) => task._id !== id))
      console.log(data.msg)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main className='w-screen min-h-screen flex flex-col items-center justify-center bg-[#3a7de0]'>
      <Head>
        <title>Mongo Todo</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1 className='text-3xl text-white my-4'>Mongo Todo</h1>
      <div className='max-w-[600px] px-4 sm:min-w-[600ti] flex flex-col items-center p-5 rounded-lg bg-white shadow-lg'>
        <form onSubmit={addTask} className='flex items-center w-full h-10 mb-3'>
          <input
            type='text'
            className='flex-grow outline-none border-2 border-solid border-[#3a7de0] rounded-tl rounded-bl text-base pl-1 shadow-md'
            placeholder='Task to be done...'
            onChange={handleChange}
            value={task.task}
          />
          <button
            className='text-lg font-bold w-[100px] cursor-pointer outline-none border-none bg-[hsl(216,73%,55%)] text-white rounded-tr rounded-br'
            type='submit'
          >
            {task._id ? 'Update' : 'Add'}
          </button>
        </form>
        {tasks.map((task, index) => (
          <div
            className='w-full h-[40px] p-1 my-1 rounded shadow flex items-center justify-center'
            key={index}
          >
            <input
              type='checkbox'
              className='cursor-pointer text-base outline-none'
              checked={task?.completed}
              onChange={() => updateTask(task?._id!)}
            />
            <p
              className={`flex-grow px-4 ${
                task?.completed ? 'line-through' : ''
              }`}
            >
              {task.task}
            </p>
            <button
              title='edit task'
              onClick={() => editTask(task?._id!)}
              className='outline-none border-none bg-transparent text-gray-600 text-base cursor-pointer px-1'
            >
              &#9998;
            </button>
            <button
              title='delete task'
              onClick={() => deleteTask(task?._id!)}
              className='outline-none border-none bg-transparent text-gray-600 text-base cursor-pointer px-1'
            >
              &#10006;
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <h2 className='w-full h-[60px] text-lg m-0 flex items-center justify-center capitalize rounded bg-[hsl(216,73%,85%)] text-gray-900'>
            No tasks
          </h2>
        )}
      </div>
    </main>
  )
}

export default Home
