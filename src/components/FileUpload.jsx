import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ENDPOINTS } from '../config';

export const FileUpload = ({ userEmail = "varun@example.com" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [files, setFiles] = useState([]);
    const inputRef = useRef(null);

    const fetchFiles = async () => {
        try {
            const res = await axios.get(ENDPOINTS.LIST_FILES, { params: { user_email: userEmail } });
            setFiles(res.data);
        } catch (err) {
            console.error("Failed to fetch files", err);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        setUploadStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_email', userEmail);

        try {
            await axios.post(ENDPOINTS.UPLOAD, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadStatus('success');
            setTimeout(() => setUploadStatus('idle'), 3000);
            fetchFiles();
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await axios.delete(ENDPOINTS.DELETE_FILE(fileId), { params: { user_email: userEmail } });
            fetchFiles();
        } catch (err) {
            console.error("Failed to delete", err);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Knowledge Base</h2>
                <p className="text-slate-400">Upload documents to ingest them into your secure corpus.</p>
            </div>

            <div
                className={`relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${dragActive
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-600"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf,.md,.txt"
                />

                <AnimatePresence mode="wait">
                    {uploadStatus === 'uploading' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-indigo-400 font-medium">Processing Document...</p>
                        </motion.div>
                    )}

                    {uploadStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="p-3 bg-green-500/20 rounded-full">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <p className="text-green-400 font-medium">Ingestion Queued</p>
                        </motion.div>
                    )}

                    {uploadStatus === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="p-3 bg-red-500/20 rounded-full">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <p className="text-red-400 font-medium">Upload Failed</p>
                            <button onClick={() => setUploadStatus('idle')} className="text-sm text-slate-400 hover:text-white underline">Try Again</button>
                        </motion.div>
                    )}

                    {uploadStatus === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 text-center"
                        >
                            <div className="p-4 bg-slate-800 rounded-full">
                                <Upload className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-slate-200">
                                    <button
                                        onClick={() => inputRef.current.click()}
                                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        Click to upload
                                    </button>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-sm text-slate-500">PDF, Markdown or Text files</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* File List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Your Corpus</h3>
                <div className="grid gap-3">
                    {files.map((file) => (
                        <div key={file._id} className="glass-panel p-4 rounded-xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-200">{file.filename}</p>
                                    <p className="text-xs text-slate-500">{(file.file_size / 1024).toFixed(1)} KB • {new Date(file.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-xs px-2 py-1 rounded-full border ${file.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    file.status === 'processing' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                                        'bg-slate-700/50 border-slate-700 text-slate-400'
                                    }`}>
                                    {file.status}
                                </span>
                                <button
                                    onClick={() => handleDelete(file._id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {files.length === 0 && (
                        <div className="text-center py-8 text-slate-500">No files uploaded yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
