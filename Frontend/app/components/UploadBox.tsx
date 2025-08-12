"use client";
import { useState, useRef, DragEvent, JSX } from "react";
import { UploadCloud, FolderOpen, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type UploadProps = {
    label: string;
    icon: JSX.Element;
    accept: string;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    disabled: boolean;
};

const Dropzone = ({ label, icon, accept, file, setFile, disabled }: UploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (!disabled && droppedFile) setFile(droppedFile);
    };

    return (
        <>
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`transition-all duration-300 ease-in-out border-2 border-dashed rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-md hover:shadow-xl ${disabled
                    ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                    : "cursor-pointer bg-white hover:border-indigo-400 border-gray-300"
                    }`}
            >
                <div className="flex justify-center mb-4 animate-fadeIn">{icon}</div>
                <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-700">
                    {label}
                    {disabled && <Lock size={18} className="text-gray-400" />}
                </div>
                <p className="text-sm text-gray-400 mt-1">{accept}</p>
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!disabled && file) setFile(file);
                    }}
                    accept={accept}
                    disabled={disabled}
                />
            </div>

            {file && (
                <div className="bg-indigo-50 p-3 rounded-xl mt-3 text-center shadow-sm">
                    <p className="text-indigo-700 font-medium break-words">{file.name}</p>
                </div>
            )}

            {disabled && !file && (
                <div className="mt-2 text-center text-gray-400 text-sm flex justify-center items-center gap-1">
                    <Lock size={16} /> Upload locked
                </div>
            )}
        </>
    );
};

export default function FileFolderUploader() {
    const [model1File, setModel1File] = useState<File | null>(null);
    const [dataset1File, setDataset1File] = useState<File | null>(null);
    const [model2File, setModel2File] = useState<File | null>(null);
    const [dataset2File, setDataset2File] = useState<File | null>(null);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [activeSection, setActiveSection] = useState<"model1" | "model2">("model1");

    const router = useRouter();
    const allFilesUploaded = !!(model1File && dataset1File && model2File && dataset2File);

    const uploadFileToSupabase = async (file: File): Promise<string> => {
        const getUrlResponse = await fetch('/api/storage/signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name }),
        });
        if (!getUrlResponse.ok) {
            throw new Error('Failed to get a secure upload URL.');
        }
        const { signedUrl, path } = await getUrlResponse.json();

        const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload file to cloud storage.`);
        }
        return path;
    };

    const handleUpload = async () => {
        if (!allFilesUploaded) {
            toast.error("Please complete all uploads");
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);

        try {
            toast.info("Uploading files to secure storage...");
            setUploadProgress(30);

            const [model1Path, model2Path, dataset1Path, dataset2Path] = await Promise.all([
                uploadFileToSupabase(model1File!),
                uploadFileToSupabase(model2File!),
                uploadFileToSupabase(dataset1File!),
                uploadFileToSupabase(dataset2File!),
            ]);

            toast.info("Files uploaded successfully. Starting benchmark...");
            setUploadProgress(70);

            const res = await fetch("/api/benchmark", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model1Path,
                    model2Path,
                    dataset1Path,
                    dataset2Path,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Benchmark process failed.");

            setUploadProgress(100);
            toast.success("Benchmark complete!");
            setTimeout(() => router.push("/result"), 1000);

        } catch (error: any) {
            console.error("Upload/Benchmark error:", error);
            toast.error(error.message || "An unexpected error occurred.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] px-4 py-6 flex flex-col items-center animate-fadeIn">

            {/* Tabs */}
            <div className="mb-8 bg-white rounded-full shadow-lg p-2 gap-2 flex flex-wrap justify-center">
                <button
                    onClick={() => setActiveSection("model1")}
                    className={`px-6 py-2 rounded-full transition font-medium ${activeSection === "model1"
                        ? "bg-purple-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    Model 1 Setup
                </button>
                <button
                    onClick={() => setActiveSection("model2")}
                    className={`px-6 py-2 rounded-full transition font-medium ${activeSection === "model2"
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    Model 2 Setup
                </button>
            </div>

            {/* Dropzone Panels */}
            {activeSection === "model1" && (
                <div className="w-full sm:w-[95%] md:w-[90%] lg:max-w-2xl bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-6 flex items-center">
                        <UploadCloud className="mr-2" /> Model 1 Configuration
                    </h2>
                    <Dropzone
                        label="Upload Model 1"
                        icon={<UploadCloud size={48} className="text-purple-500" />}
                        accept=".onnx" // <-- UPDATED
                        file={model1File}
                        setFile={setModel1File}
                        disabled={isUploading}
                    />
                    <div className="mt-6" />
                    <Dropzone
                        label="Dataset for Model 1"
                        icon={<FolderOpen size={48} className="text-purple-500" />}
                        accept=".zip"
                        file={dataset1File}
                        setFile={setDataset1File}
                        disabled={isUploading}
                    />
                </div>
            )}

            {activeSection === "model2" && (
                <div className="w-full sm:w-[95%] md:w-[90%] lg:max-w-2xl bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-6 flex items-center">
                        <UploadCloud className="mr-2" /> Model 2 Configuration
                    </h2>
                    <Dropzone
                        label="Upload Model 2"
                        icon={<UploadCloud size={48} className="text-blue-500" />}
                        accept=".onnx" // <-- UPDATED
                        file={model2File}
                        setFile={setModel2File}
                        disabled={isUploading}
                    />
                    <div className="mt-6" />
                    <Dropzone
                        label="Dataset for Model 2"
                        icon={<FolderOpen size={48} className="text-blue-500" />}
                        accept=".zip"
                        file={dataset2File}
                        setFile={setDataset2File}
                        disabled={isUploading}
                    />
                </div>
            )}

            {/* Upload Button and Progress */}
            <div className="w-full sm:w-[95%] md:w-[90%] lg:max-w-2xl mb-10">
                {uploadProgress > 0 && (
                    <div className="mb-4 bg-white p-4 rounded-xl shadow">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-indigo-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!allFilesUploaded || isUploading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition duration-200 ease-in-out shadow-lg ${!allFilesUploaded
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : isUploading
                            ? "bg-blue-500 text-white cursor-wait"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                >
                    {isUploading ? "Processing..." : "Compare Models"}
                </button>

                {allFilesUploaded && !isUploading && (
                    <div className="mt-4 text-center text-sm text-gray-500">
                        ✅ All files ready. Click Compare Models to start.
                    </div>
                )}
            </div>
        </div>
    );
}