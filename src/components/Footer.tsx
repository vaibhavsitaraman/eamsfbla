
import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="w-full py-16 px-16 md:px-12 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="space-y-6">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Edison Academy FBLA empowers students to become leaders and innovators in business and entrepreneurship through competitive events, community service, and career development.
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-foreground">Quick links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Google Classroom</a></li>
                <li><a href="https://www.njfbla.org/" target="_blank" rel="noreferrer" className="hover:text-foreground">SLC website (njfbla.org)</a></li>
                <li><a href="https://www.fbla.org/" target="_blank" rel="noreferrer" className="hover:text-foreground">NLC website (fbla.org)</a></li>
              </ul>
            </div>
          </div>


          <div className="space-y-6">
            <p className="text-muted-foreground max-w-xs">
              This website was made by Vaibhav Sitaraman, EAMS FBLA Liaison of Webmaster. Please reach out to sitaramanv28@mcmsnj.net with any website inquiries.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
