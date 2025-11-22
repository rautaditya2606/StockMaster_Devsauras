'use client';

'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import CreateTaskForm from '../../components/tasks/CreateTaskForm';
import { createTask, getTasksForManager } from '../../services/taskService';
import { getUsers } from '../../services/userService';
import StatusBadge from '../../components/StatusBadge';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksData, usersData] = await Promise.all([
                    getTasksForManager(),
                    getUsers(),
                ]);
                setTasks(tasksData);
                setUsers(usersData.filter(user => user.role === 'WAREHOUSE_STAFF'));
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateTask = async (taskData) => {
        try {
            const newTask = await createTask(taskData);
            setTasks([newTask, ...tasks]);
        } catch (err) {
            setError('Error creating task');
        }
    };

    const columns = [
        { key: 'title', label: 'Title' },
        { 
            key: 'assignedTo',
            label: 'Assigned To',
            render: (assignedTo) => assignedTo?.name || 'N/A'
        },
        { 
            key: 'status',
            label: 'Status',
            render: (status) => <StatusBadge status={status} />
        },
        { 
            key: 'createdAt',
            label: 'Created At',
            render: (value) => new Date(value).toLocaleDateString()
        },
    ];

    return (
        <Layout>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Tasks</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Task
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <DataTable columns={columns} data={tasks} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a New Task">
                <CreateTaskForm 
                    users={users} 
                    onCreateTask={handleCreateTask} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </Modal>
        </Layout>
    );
};

export default TasksPage;
