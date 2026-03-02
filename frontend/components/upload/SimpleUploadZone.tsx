'use client'

import React, { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, File, Image, FileText, Film, Music } from 'lucide-react'

interface FileWithPreview extends File {
  preview?: string
  id?: string
}

interface UploadZoneProps {
  onUpload: (files: File[]) => void | Promise<void>
  accept?: string
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  className?: string
  disabled?: boolean
  showPreviews?: boolean
  value?: FileWithPreview[]
  onChange?: (files: FileWithPreview[]) => void
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return <Image className="w-8 h-8" />
  if (file.type.startsWith('video/')) return <Film className="w-8 h-8" />
  if (file.type.startsWith('audio/')) return <Music className="w-8 h-8" />
  if (file.type.startsWith('text/')) return <FileText className="w-8 h-8" />
  return <File className="w-8 h-8" />
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function SimpleUploadZone({
  onUpload,
  accept,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  multiple = true,
  className,
  disabled = false,
  showPreviews = true,
  value = [],
  onChange,
}: UploadZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>(value)
  const [dragActive, setDragActive] = useState(false)
  const [rejectedFiles, setRejectedFiles] = useState<{ file: File; error: string }[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const validateFiles = useCallback((fileList: FileList) => {
    const acceptedFiles: File[] = []
    const rejected: { file: File; error: string }[] = []

    Array.from(fileList).forEach((file) => {
      // 检查文件大小
      if (file.size > maxSize) {
        rejected.push({ file, error: `File too large (max ${formatFileSize(maxSize)})` })
        return
      }

      // 检查文件类型
      if (accept && !accept.split(',').some((type) => file.type.match(type.trim()))) {
        rejected.push({ file, error: 'Invalid file type' })
        return
      }

      acceptedFiles.push(file)
    })

    return { acceptedFiles, rejected }
  }, [accept, maxSize])

  const handleFiles = useCallback((fileList: FileList) => {
    if (disabled) return

    const { acceptedFiles, rejected } = validateFiles(fileList)
    setRejectedFiles(rejected)

    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        id: Math.random().toString(36).substr(2, 9),
      }),
    ) as FileWithPreview[]

    const newFiles = multiple ? [...files, ...filesWithPreview] : filesWithPreview
    setFiles(newFiles.slice(0, maxFiles))
    onChange?.(newFiles.slice(0, maxFiles))

    if (filesWithPreview.length > 0) {
      onUpload(filesWithPreview)
    }
  }, [disabled, files, multiple, maxFiles, validateFiles, onUpload, onChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const removeFile = (fileId: string) => {
    const newFiles = files.filter((f) => f.id !== fileId)
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  const clearAll = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setRejectedFiles([])
    onChange?.([])
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 上传区域 */}
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          'hover:border-cyber-cyan hover:bg-cyber-cyan/5',
          dragActive && 'border-cyber-cyan bg-cyber-cyan/10',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        <Upload
          className={cn(
            'w-12 h-12 mx-auto mb-4 transition-colors',
            dragActive ? 'text-cyber-cyan' : 'text-gray-500',
          )}
        />
        {dragActive ? (
          <p className="text-cyber-cyan">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-300 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Max {maxFiles} file{maxFiles > 1 ? 's' : ''}, {formatFileSize(maxSize)} each
            </p>
          </div>
        )}
      </div>

      {/* 被拒绝的文件 */}
      {rejectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-cyber-pink font-semibold">Rejected files:</p>
          {rejectedFiles.map(({ file, error }, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-cyber-pink/10 border border-cyber-pink rounded"
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm text-gray-300">{file.name}</p>
                  <p className="text-xs text-cyber-pink">{error}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 文件预览 */}
      {showPreviews && files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <button
              onClick={clearAll}
              className="text-xs text-cyber-pink hover:text-cyber-pink/80 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id || file.name}
                className="flex items-center justify-between p-3 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview!)
                      }}
                    />
                  ) : (
                    <div className="text-cyber-cyan">{getFileIcon(file)}</div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-200">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file.id!)
                  }}
                  className="p-2 text-cyber-pink hover:text-cyber-pink/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
