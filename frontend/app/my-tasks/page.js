'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import { getTasksForWorker, updateTaskStatus } from '../../services/taskService';
import { StatusBadge } from '../../components/StatusBadge';

const MyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksData = await getTasksForWorker();
                setTasks(tasksData);
            } catch (err) {
                setError('Error fetching tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, status) => {
        try {
            const updatedTask = await updateTaskStatus(taskId, status);
            setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
        } catch (err) {
            setError('Error updating task status');
        }
    };

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'assignedBy', label: 'Assigned By', render: (assignedBy) => assignedBy?.name || 'N/A' },
        {
            key: 'status',
            label: 'Status',
            render: (status, row) => {
                const statusColors = {
                    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    ONGOING: 'bg-blue-100 text-blue-800 border-blue-300',
                    COMPLETED: 'bg-green-100 text-green-800 border-green-300',
                };

                return (
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className={`p-1.5 text-sm rounded-md border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                );
            }
        },
        { key: 'createdAt', label: 'Created At', render: (value) => new Date(value).toLocaleDateString() },
    ];

    return (
        <Layout>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <DataTable columns={columns} data={tasks} />
                )}
            </div>
        </Layout>
    );
};

export default MyTasksPage;
