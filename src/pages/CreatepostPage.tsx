import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ReactQuill from 'react-quill-new';
import { motion } from "framer-motion";
import 'react-quill-new/dist/quill.snow.css';
import "./QuillStyles.css";
import DOMPurify from 'dompurify';
import { createBlogPost } from "../services/blogService";
import { useAuthStore } from '../store/AuthStore'; 
import { toast } from "react-toastify";
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from "../api/config";

//TODO: create edit page same as this page
//TODO: add middleware to this page

const CreatePostPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        title: string;
        category: string;
        description: string;
        coverImage: File | null;
        coverImagePreview: string | undefined;
        content: string;
        tags: string[];
        currentTag: string;
    }>({
        title: "",
        category: "",
        description: "",
        coverImage: null,
        coverImagePreview: undefined,
        content: "",
        tags: [],
        currentTag: ""
    });

    const { user, isAuthenticated } = useAuthStore();

    const [previewOpen, setPreviewOpen] = useState(false);

    const categories = ["Learn", "Tools", "Tech", "Operations", "Inspiration", "News"];

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a blog post.");
            navigate("/");
        }
    }
    , [isAuthenticated, navigate]);

    const [uploadStatus, setUploadStatus] = useState<{
        isUploading: boolean;
        progress: number;
        error: string | null;
    }>({
        isUploading: false,
        progress: 0,
        error: null
    });

    const removeImage = () => {
        setFormData(prev => ({ 
            ...prev, 
            coverImage: null, 
            coverImagePreview: undefined
        }));
        setUploadStatus(prev => ({ 
            ...prev, 
            error: null,
            progress: 0 
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                setUploadStatus(prev => ({
                    ...prev,
                    error: "Please upload a valid image file (JPEG, PNG, GIF, SVG)"
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setFormData(prev => ({
                        ...prev,
                        coverImage: file,
                        coverImagePreview: reader.result as string
                    }));
                    setUploadStatus(prev => ({ ...prev, error: null }));
                } else {
                    console.error("FileReader result is not a string:", reader.result);
                    setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: undefined }));
                }
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: undefined }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: undefined }));
        }
    };

    const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
        setUploadStatus(prev => ({ 
            ...prev, 
            isUploading: true,
            progress: 0,
            error: null 
        }));
        
        try {
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', file);
            formDataToUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadStatus(prev => ({ ...prev, progress }));
                    }
                });
                
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            setUploadStatus(prev => ({
                                ...prev,
                                isUploading: false,
                                progress: 100
                            }));
                            resolve(response.secure_url);
                        } else {
                            console.error('Error uploading to Cloudinary:', xhr.statusText);
                            setUploadStatus(prev => ({
                                ...prev,
                                isUploading: false,
                                error: 'Failed to upload image. Please try again.'
                            }));
                            reject(new Error('Upload failed'));
                        }
                    }
                };
                
                xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
                xhr.send(formDataToUpload);
            });
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            setUploadStatus(prev => ({
                ...prev,
                isUploading: false,
                error: 'Failed to upload image. Please try again.'
            }));
            return null;
        }
    };

    const addTag = () => {
        const trimmedTag = formData.currentTag.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag],
                currentTag: ""
            }));
        } else if (trimmedTag && formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({ ...prev, currentTag: "" }));
        }
        //  else if (!trimmedTag) {
        //     showFeedback("Please enter a tag", "warning");
        // }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.content) {
            return;
        }

        try {

            let cloudinaryUrl = null;
            
            if (formData.coverImage) {
                cloudinaryUrl = await uploadImageToCloudinary(formData.coverImage);
                
                if (!cloudinaryUrl) {
                    toast.error("Failed to upload cover image. Please try again.");
                    return;
                }
            }
            
            const blogData = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                content: formData.content,
                tags: formData.tags,
                authorId: user!.uid,
                authorName: user!.displayName || undefined,
                coverImage: cloudinaryUrl || null,
            }
    
            const blogPostId = await createBlogPost(blogData);
            
            console.log("Blog created successfully with ID:", blogPostId);

            toast.success("Blog post created successfully!"); //TODO: make the style of the toast match the design

            navigate("/"); // TODO: Redirect to the newly created blog post page 
            
        } catch (error) {
            console.error("Error creating blog post:", error);
            toast.error("Failed to create blog post. Please try again.");
        }


    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'code-block'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list',
        'link', 'image',
        'code-block',
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="w-full relative overflow-hidden min-h-screen">
            <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 -left-10 md:left-1/4 w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 rounded-full bg-blue-500/10 dark:bg-blue-400/20 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 -right-10 md:right-1/4 w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 rounded-full bg-rose-500/10 dark:bg-rose-400/20 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-amber-500/10 dark:bg-amber-400/20 blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 md:py-16 relative">
                <motion.div
                    className="mb-4 sm:mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <Link to="/" className="flex items-center text-gray-600 dark:text-gray-400 mb-4 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Create <span className="bg-gradient-to-tl from-indigo-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">New Blog Post</span>
                    </h1>
                    <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
                        Share your thoughts, insights, and stories with captivating content and images.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent my-4 sm:my-8"
                ></motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cover Image
                        </label>
                        {formData.coverImagePreview ? (
                            <div className="relative mb-4">
                                <img
                                    src={formData.coverImagePreview}
                                    alt="Cover preview"
                                    className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    aria-label="Remove image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 md:h-64 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                                        <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span>
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (max 5MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleCoverImageChange}
                                    />
                                </label>
                            </div>
                        )}
                        {uploadStatus.error && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {uploadStatus.error}
                            </p>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Post Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base sm:text-lg transition-shadow duration-200 ease-in-out shadow-sm hover:shadow-md"
                                placeholder="Enter title"
                            />
                        </motion.div>

                        <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-shadow duration-200 ease-in-out shadow-sm hover:shadow-md appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                            >
                                <option value="" disabled>Select category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </motion.div>
                    </div>

                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Short Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-shadow duration-200 ease-in-out shadow-sm hover:shadow-md"
                            placeholder="Brief description (optional)"
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Post Content
                        </label>
                        <div className="overflow-visible scrollbar-hide">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={modules}
                                formats={formats}
                                placeholder="Write your blog post content here..."
                                className="bg-white dark:bg-gray-800 h-120 border-gray-300 dark:border-gray-700 rounded-lg pb-10 mb-10"
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Use the toolbar above to format text, add links, and insert images.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                        className="pt-2 sm:pt-4"
                    >
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tags
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-grow flex">
                                <input
                                    type="text"
                                    id="currentTag"
                                    name="currentTag"
                                    value={formData.currentTag}
                                    onChange={handleChange}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-grow px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                                    placeholder="Add tags..."
                                />
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={addTag}
                                    className="px-3 py-2 sm:px-4 sm:py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors shadow-sm"
                                >
                                    Add
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 shadow-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 focus:outline-none"
                                        aria-label={`Remove tag ${tag}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </motion.span>
                            ))}
                            {formData.tags.length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                                    No tags added yet
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5 }}
                        className="mt-6 sm:mt-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md"
                    >
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Preview</h3>
                            <div
                                className="flex items-center hover:cursor-pointer"
                                onClick={() => { setPreviewOpen(!previewOpen) }}
                            >
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mr-2">Preview post</span>
                                <motion.button
                                    type="button"
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{ rotate: previewOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    aria-label={previewOpen ? "Hide preview" : "Show preview"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </motion.button>
                            </div>
                        </div>

                        {previewOpen && (
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-3 sm:p-4 md:p-6 shadow-lg overflow-hidden"
                            >
                                {formData.coverImagePreview && (
                                    <img
                                        src={formData.coverImagePreview}
                                        alt="Cover preview"
                                        className="w-full h-36 sm:h-48 md:h-64 object-cover rounded-xl mb-4 sm:mb-6 shadow-md"
                                    />
                                )}

                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                                    {formData.title || "Your Post Title"}
                                </h1>

                                {formData.category && (
                                    <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-3 sm:mb-4 shadow-sm">
                                        {formData.category}
                                    </span>
                                )}

                                {formData.description && (
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 italic text-sm sm:text-base md:text-lg">
                                        {formData.description}
                                    </p>
                                )}

                                <div
                                    className="ql-editor prose prose-sm sm:prose dark:prose-invert max-w-none prose-img:rounded-lg prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400 text-gray-700 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.content) || "<p>Your post content will appear here...</p>" }}
                                >
                                </div>

                                {formData.tags.length > 0 && (
                                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map(tag => (
                                                <span key={tag} className="inline-block bg-indigo-100 dark:bg-indigo-900 rounded-full px-2 py-1 text-xs font-semibold text-indigo-800 dark:text-indigo-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link to="/" className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="relative overflow-hidden rounded-lg text-white px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base hover:cursor-pointer"
                        >
                            <div className="absolute inset-0 h-full w-full animate-gradient bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 bg-size-200 rounded-lg opacity-100 transition-opacity group-hover:opacity-90"></div>
                            <span className="relative z-10 flex items-center">
                                Publish Post
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;