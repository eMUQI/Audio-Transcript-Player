import { useEffect, useState } from 'react';
import { translate } from './i18n';
import Player from './VTT/Player.jsx';
import { ConfigProvider, Upload, message, Button } from 'antd';
import { ArrowUpOutlined, AudioOutlined, FileTextOutlined, GithubOutlined, SwapOutlined, CheckOutlined } from '@ant-design/icons';
import './App.css';
import { handleAudioUpload, handleTranscriptUpload, convertSRTtoVTT } from './uploadHandler';

const accept = 'audio/*,.mp3,.m4a,.wav,.vtt,.srt';
const theme = {
    token: {
        colorPrimary: '#32634b',
        borderRadius: 8,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        controlHeight: 40,
    },
};

function App() {
    const [language, setLanguage] = useState(() => {
        try {
            const saved = localStorage.getItem('language');
            if (saved === 'zh' || saved === 'en') return saved;
        } catch { /* 存储不可用时跟随浏览器语言 */ }
        return navigator.language.startsWith('zh') ? 'zh' : 'en';
    });
    const t = (text) => translate(language, text);
    useEffect(() => {
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
        document.title = translate(language, 'Audio Transcript Player');
        try { localStorage.setItem('language', language); } catch { /* 忽略 */ }
    }, [language]);
    const [audioSrc, setAudioSrc] = useState(null);
    const [transcriptSrc, setTranscriptSrc] = useState(null);
    const [audioName, setAudioName] = useState('');
    const [transcriptName, setTranscriptName] = useState('');
    const ready = Boolean(audioSrc && transcriptSrc);
    const [messageApi, messageHolder] = message.useMessage();

    const onFileUpload = (file) => {
        try {
            if (file.type.startsWith('audio/')) {
                handleAudioUpload(file, setAudioSrc, audioSrc);
                setAudioName(file.name);
            } else if (/\.(srt|vtt)$/i.test(file.name)) {
                handleTranscriptUpload(file, (src) => {
                    setTranscriptSrc(src);
                    setTranscriptName(file.name);
                }, transcriptSrc, convertSRTtoVTT);
            } else {
                messageApi.error(t('Choose an audio file or an SRT / VTT subtitle file.'));
            }
        } catch (error) {
            messageApi.error(error.message);
        }
        return false;
    };

    return (
        <ConfigProvider theme={theme}>
            {messageHolder}
            <div className="app-layout">
                <a className="skip-link" href="#main">{t('Skip to content')}</a>
                <header className="app-header">
                    <a className="wordmark" href="./">{t('Audio Transcript Player')}</a>
                    <div className="language-switch" role="group" aria-label="Language / 语言">
                        <button type="button" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
                        <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
                    </div>
                </header>
                <main id="main" className="app-content">
                    {ready ? (
                        <>
                            <h1 className="usage-title">{t('Listen with the transcript')}</h1>
                            <p className="usage-description">{t('Follow along, or select any line to hear it again.')}</p>
                            <section className="listening-panel" aria-label={t('Listening workspace')}>
                                <div className="session-header">
                                    <div className="session-files">
                                        <h2 title={audioName}>{audioName}</h2>
                                        <p title={transcriptName}>{transcriptName}</p>
                                    </div>
                                    <Upload beforeUpload={onFileUpload} showUploadList={false} accept={accept} multiple>
                                        <Button icon={<SwapOutlined />}>{t('Change files')}</Button>
                                    </Upload>
                                </div>
                                <Player key={`${audioSrc}:${transcriptSrc}`} audio={audioSrc} transcript={transcriptSrc} language={language} />
                            </section>
                        </>
                    ) : (
                        <section className="import-panel" aria-labelledby="import-title">
                            <div className="section-heading">
                                <h1 id="import-title">{t('Start with your files')}</h1>
                                <span className="step-count">{Number(Boolean(audioSrc)) + Number(Boolean(transcriptSrc))} / 2 {t('files')}</span>
                            </div>
                            <p className="import-copy">{t('Choose one audio file and its matching subtitles, together or one at a time.')}</p>
                            <Upload.Dragger beforeUpload={onFileUpload} showUploadList={false} accept={accept} multiple>
                                <span className="upload-symbol"><ArrowUpOutlined /></span>
                                <span className="upload-title">{t('Choose files')}</span>
                                <span className="upload-description">{t('or drop them here')}</span>
                            </Upload.Dragger>
                            <div className="file-checklist" aria-live="polite">
                                <div className={audioName ? 'file-ready' : ''}>
                                    <AudioOutlined />
                                    <span>
                                        <strong>{t('Audio')}</strong>
                                        <span title={audioName}>{audioName || t('Choose an audio file')}</span>
                                    </span>
                                    {audioName && <CheckOutlined aria-label={t('Selected')} />}
                                </div>
                                <div className={transcriptName ? 'file-ready' : ''}>
                                    <FileTextOutlined />
                                    <span>
                                        <strong>{t('Transcript')}</strong>
                                        <span title={transcriptName}>{transcriptName || t('Choose an SRT or VTT file')}</span>
                                    </span>
                                    {transcriptName && <CheckOutlined aria-label={t('Selected')} />}
                                </div>
                            </div>
                            <p className="local-note">{t('Your files stay in your browser. No account needed.')}</p>
                        </section>
                    )}
                </main>
                <footer className="app-footer">
                    <a href="https://github.com/eMUQI/Audio-Transcript-Player" target="_blank" rel="noopener noreferrer">
                        <GithubOutlined /> GitHub <span aria-hidden="true">↗</span>
                    </a>
                </footer>
            </div>
        </ConfigProvider>
    );
}
export default App;
