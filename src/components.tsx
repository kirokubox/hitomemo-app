import React from 'react';
import { Conversation, Person } from './types';

export function PrivacyNote() {
  return <section className="notice strong"><p>ひとめもは、会話を思い出すための軽いメモアプリです。</p><p>本名・住所・電話番号・メールアドレス・顔写真など、相手を強く特定できる情報は登録しないでください。</p><p>呼び名、関係、性格、好きなこと、苦手なもの、前に話したこと、次に話したいことなど、会話を思い出すための情報だけを残す使い方を想定しています。</p></section>;
}

type TextareaSize = 'compact' | 'medium' | 'long';

function textareaRows(value: string, size: TextareaSize) {
  const lineCount = Math.max(1, value.split('\n').length);
  if (size === 'compact') return value.trim() ? Math.min(3, lineCount) : 1;
  if (size === 'medium') return Math.max(3, Math.min(5, lineCount));
  return Math.max(4, Math.min(7, lineCount));
}

export function Field({ label, value, onChange, multiline, type = 'text', required, hint, textareaSize = 'long' }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string; required?: boolean; hint?: string; textareaSize?: TextareaSize }) {
  const id = label.replace(/\s/g, '-');
  return <label className="field" htmlFor={id}><span>{label}{required && <b> 必須</b>}</span>{hint && <small>{hint}</small>}{multiline ? <textarea className={`textarea-${textareaSize}`} id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={textareaRows(value, textareaSize)} /> : <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function MemoRows({ rows }: { rows: [string, string][] }) {
  return <dl className="memo-list">{rows.map(([label, value]) => <React.Fragment key={label}><dt>{label}</dt><dd>{value || '（未入力）'}</dd></React.Fragment>)}</dl>;
}

export function BasicMemoSummary({ person }: { person: Person }) {
  const profileItems: [string, string][] = [['年齢', person.ageNote], ['性別', person.genderNote], ['身長', person.heightNote], ['職業', person.jobNote], ['MBTI', person.mbtiNote]];
  const basicRows: [string, string][] = [['呼び名', person.nickname], ['関係', person.relation]];
  const featureRows: [string, string][] = [['見た目・雰囲気', person.appearanceNote], ['性格', person.personalityNote], ['好きなこと', person.likesNote], ['苦手・嫌いなもの', person.dislikesNote], ['その人らしさメモ', person.uniquenessNote]];
  return <div className="basic-memo-summary"><MemoRows rows={basicRows} /><div className="profile-grid" aria-label="基本属性">{profileItems.map(([label, value]) => <div className="profile-chip" key={label}><span>{label}</span><strong>{value || '未設定'}</strong></div>)}</div><MemoRows rows={featureRows} /></div>;
}

export function MeetBeforeMemoSummary({ person }: { person: Person }) {
  const rows: [string, string][] = [['覚えておきたいこと', person.rememberNote], ['次に話したいこと', person.nextTalkNote], ['自分が感じていること', person.feelingNote], ['自由メモ', person.memo]];
  return <MemoRows rows={rows} />;
}

export function BasicMemoEditForm({ draft, setDraft, onSave, onCancel }: { draft: Person; setDraft: React.Dispatch<React.SetStateAction<Person>>; onSave: () => void; onCancel: () => void }) {
  const set = (key: keyof Person, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  return <div className="stack compact"><Field label="呼び名" required value={draft.nickname} onChange={(value) => set('nickname', value)} /><Field label="関係" value={draft.relation} onChange={(value) => set('relation', value)} /><Field label="年齢" value={draft.ageNote} onChange={(value) => set('ageNote', value)} /><Field label="性別" value={draft.genderNote} onChange={(value) => set('genderNote', value)} /><Field label="身長" value={draft.heightNote} onChange={(value) => set('heightNote', value)} /><Field label="職業" value={draft.jobNote} onChange={(value) => set('jobNote', value)} /><Field label="MBTI" value={draft.mbtiNote} onChange={(value) => set('mbtiNote', value)} /><Field label="見た目・雰囲気" multiline textareaSize="compact" value={draft.appearanceNote} onChange={(value) => set('appearanceNote', value)} /><Field label="性格" multiline textareaSize="compact" value={draft.personalityNote} onChange={(value) => set('personalityNote', value)} /><Field label="好きなこと" multiline textareaSize="compact" value={draft.likesNote} onChange={(value) => set('likesNote', value)} /><Field label="苦手・嫌いなもの" multiline textareaSize="compact" value={draft.dislikesNote} onChange={(value) => set('dislikesNote', value)} /><Field label="その人らしさメモ" multiline textareaSize="compact" value={draft.uniquenessNote} onChange={(value) => set('uniquenessNote', value)} /><div className="button-row"><button className="primary inline-primary" type="button" onClick={onSave}>保存する</button><button className="secondary" type="button" onClick={onCancel}>キャンセル</button></div></div>;
}

export function MeetBeforeMemoEditForm({ draft, setDraft, onSave, onCancel }: { draft: Person; setDraft: React.Dispatch<React.SetStateAction<Person>>; onSave: () => void; onCancel: () => void }) {
  const set = (key: keyof Person, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  return <div className="stack compact"><Field label="覚えておきたいこと" multiline textareaSize="medium" value={draft.rememberNote} onChange={(value) => set('rememberNote', value)} /><Field label="次に話したいこと" multiline textareaSize="medium" value={draft.nextTalkNote} onChange={(value) => set('nextTalkNote', value)} /><Field label="自分が感じていること" multiline textareaSize="medium" value={draft.feelingNote} onChange={(value) => set('feelingNote', value)} /><Field label="自由メモ" multiline textareaSize="medium" value={draft.memo} onChange={(value) => set('memo', value)} /><div className="button-row"><button className="primary inline-primary" type="button" onClick={onSave}>保存する</button><button className="secondary" type="button" onClick={onCancel}>キャンセル</button></div></div>;
}

export function ConversationFields({ value, setValue }: { value: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'> | Conversation; setValue: React.Dispatch<React.SetStateAction<any>> }) {
  const set = (key: keyof Conversation, next: string) => setValue((current: Conversation) => ({ ...current, [key]: next }));
  return <><Field label="会った日・話した日" type="date" value={value.metDate} onChange={(next) => set('metDate', next)} /><Field label="場所・場面" value={value.placeNote} onChange={(next) => set('placeNote', next)} /><Field label="話したこと" multiline textareaSize="long" value={value.talkedAbout} onChange={(next) => set('talkedAbout', next)} /><Field label="感じたこと・メモ" multiline textareaSize="long" value={value.memo} onChange={(next) => set('memo', next)} /></>;
}


