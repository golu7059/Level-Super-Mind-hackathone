import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { FiSearch, FiBarChart2, FiUsers, FiMessageCircle } from 'react-icons/fi'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function App() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:5000/run_flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      })
      const data = await res.json()
      const markdownMessage = data.outputs[0].outputs[0].artifacts.message

      // convert the markdown message to JSON
      const jsonData = JSON.parse(markdownMessage.replace(/```json|```/g, ''))
      setResponse(jsonData)
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: 'An error occurred while fetching the response.' })
    }
    setIsLoading(false)
  }

  const chartData = {
    labels: ['Likes', 'Comments', 'Shares', 'Views'],
    datasets: [
      {
        label: 'Engagement Metrics',
        data: [1200, 600, 300, 2000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Social Media Engagement',
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover opacity-50">
        <source src="/placeholder.svg?height=1080&width=1920" type="video/mp4" />
      </video>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl z-10 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">Social Media Analytics Dashboard</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center bg-white rounded-lg shadow-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your analytics query..."
              className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-500 text-white px-6 py-3 rounded-r-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors disabled:bg-purple-300 flex items-center"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
              <FiSearch className="ml-2" />
            </button>
          </div>
          <div>
            {response.analysisResults.insights && (
              <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-purple-700">Analysis Results:</h2>
                <pre className="whitespace-pre-wrap break-words text-sm bg-gray-100 p-4 rounded">
                  {response.analysisResults.insights}
                </pre>
              </div>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard title="Total Followers" value="10,234" icon={<FiUsers />} />
          <MetricCard title="Engagement Rate" value="4.7%" icon={<FiBarChart2 />} />
          <MetricCard title="Avg. Comments" value="42" icon={<FiMessageCircle />} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Analysis Results:</h2>
            <pre className="whitespace-pre-wrap break-words text-sm bg-gray-100 p-4 rounded">{JSON.stringify(response, null, 2)}</pre>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <span className="text-purple-500 text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-purple-600">{value}</p>
    </div>
  )
}

