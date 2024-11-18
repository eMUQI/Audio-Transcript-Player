import React, { useState } from 'react';
import Player from './VTT/Player.jsx';
import { Layout, Typography, Upload, message, Card, Button } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import './App.css';
import { handleAudioUpload, handleTranscriptUpload, convertSRTtoVTT } from './uploadHandler';

const { Content } = Layout;
const { Title } = Typography;
const { Dragger } = Upload;

function App() {
    const [audioSrc, setAudioSrc] = useState(null);
    const [transcriptSrc, setTranscriptSrc] = useState(null);

    const onFileUpload = (file) => {
        const fileType = file.type;
        const fileName = file.name;

        if (fileType.startsWith('audio')) {
            try {
                handleAudioUpload(file, setAudioSrc, audioSrc);
            } catch (error) {
                message.error(error.message);
            }
        } else if (fileName.endsWith('.srt') || fileName.endsWith('.vtt')) {
            try {
                handleTranscriptUpload(file, setTranscriptSrc, transcriptSrc, convertSRTtoVTT);
            } catch (error) {
                message.error(error.message);
            }
        } else {
            message.error('Unsupported file type. Please upload an audio or subtitle file.');
        }

        return false; 
    };

    return (
        <Layout className="app-layout">
            <Content className="app-content">
                <Card className="main-card">
                    <Title level={1} className="app-title">
                        Audio Transcript Player
                    </Title>
                    {audioSrc && transcriptSrc ? (
                        <>
                            <div className="reupload-button-container">
                                <Button icon={<DeleteOutlined />}
                                    onClick={() => {
                                        setAudioSrc(null);
                                        setTranscriptSrc(null);
                                    }}
                                >
                                    Re-upload Files
                                </Button>
                            </div>

                            <Player audio={audioSrc} transcript={transcriptSrc} />
                        </>
                    ) : (
                        <Dragger
                            beforeUpload={onFileUpload}
                            showUploadList={false}
                            accept="audio/mp3,audio/mp4,audio/mpeg,audio/wav,audio/x-m4a,.mp3,.m4a,.wav,.vtt,.srt"
                            multiple={true}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Support for multiple audio files and subtitle files (SRT, VTT).
                            </p>
                        </Dragger>
                    )}
                </Card>
            </Content>
        </Layout>
    );
}

export default App;