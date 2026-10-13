import { BookOpen, Heart } from 'lucide-react';

export default function Footer() {
  return <footer className="site-footer"><div className="footer-inner shell"><div className="footer-brand"><span className="footer-logo"><BookOpen size={18}/></span><strong>studyhub<span>.</span></strong><span className="footer-sep"/><span>Learn something good today.</span></div><div className="footer-end">Made for curious minds <Heart size={14}/> <span className="footer-sep"/> Simulated API · Browser storage</div></div></footer>;
}
