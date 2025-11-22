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
        { key: 'assignedBy.name', label: 'Assigned By', render: (value, row) => row.assignedBy?.name || 'N/A' },
        {
            key: 'status',
            label: 'Status',
            render: (status, row) => (
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="PENDING">Pending</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            )
        },
        { key: 'createdAt', label: 'Created At', render: (value) => new Date(value).toLocaleDateString() },
    ];

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading ? <p>Loading...</p> : <DataTable columns={columns} data={tasks} />}
            </div>
        </Layout>
    );
};

export default MyTasksPage;
