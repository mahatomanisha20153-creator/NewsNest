import Icon from './Icon.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ShareButtons({ id, title }) {
  const toast = useToast();
  const url = `${window.location.origin}/article/${id}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  async function copyLink() {
    // Bonus: native share sheet on touch devices that support it
    const isTouch = window.matchMedia?.('(pointer: coarse)').matches;
    if (isTouch && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // user closed the sheet, not an error
        // any other failure: fall through to copying
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for plain-http pages and older browsers
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand copy failed');
      }
      toast('Link copied');
    } catch {
      toast('Could not copy the link', 'error');
    }
  }

  return (
    <div className="share">
      <button className="share-btn" onClick={copyLink} aria-label="Copy link" title="Copy link">
        <Icon name="link" size={18} />
      </button>
      <a className="share-btn share-x" href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`} target="_blank" rel="noreferrer" aria-label="Share on X">X</a>
      <a className="share-btn share-fb" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook">f</a>
      <a className="share-btn share-in" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">in</a>
      <a className="share-btn share-wa" href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp">wa</a>
    </div>
  );
}