import { useState } from 'react';
import Link from "@cloudscape-design/components/link";
import { FormattedMessage } from 'react-intl';
import { colorBorderDropdownItemHover, colorBackgroundControlDefault, colorBackgroundLayoutToggleDefault, spaceScaledXs, spaceScaledL, spaceScaledXl } from '@cloudscape-design/design-tokens';
import { footerColor, Links } from './constants'
import './footer.css'

export const Footer = () => {
    
    const [currentFooterColor, setCurrentFootercolor] = useState(footerColor);

    const handleMouseEnter = (type:Links) => {
        const hoverColor = {...footerColor, [type]:{color:colorBorderDropdownItemHover}}
        setCurrentFootercolor(hoverColor);
    };
    const handleMouseLeave = (type:Links) => {
        const defaultColor = {...footerColor, [type]:{color:colorBackgroundControlDefault}}
        setCurrentFootercolor(defaultColor);
    };
    const footerStyle = {
        color: colorBackgroundControlDefault,
        backgroundColor: colorBackgroundLayoutToggleDefault,
        padding: `${spaceScaledXs} ${spaceScaledL}`
    };

    const gapStyle = {
        gap: spaceScaledXl
    }
    
  return (
    <footer id='app-footer' className="dashboard-footer-container" style={footerStyle} data-testid="footer-component">
            <ul style={gapStyle}>
                <li>
                    <Link  data-testid="cloudshell-link" href="#">
                        <span style={currentFooterColor['cloudshell']} onMouseEnter={()=> handleMouseEnter('cloudshell')} onMouseLeave={()=>handleMouseLeave('cloudshell')}>
                            <FormattedMessage defaultMessage="Cloudshell" description="Open Cloudshell link"/>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link  data-testid="feedback-link" href="#">
                        <span style={currentFooterColor['feedback']} onMouseEnter={()=> handleMouseEnter('feedback')} onMouseLeave={()=>handleMouseLeave('feedback')}>
                            <FormattedMessage defaultMessage="Feedback" description="Open Feedback link"/>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link  data-testid="language-link" href="#">
                        <span style={currentFooterColor['language']} onMouseEnter={()=> handleMouseEnter('language')} onMouseLeave={()=>handleMouseLeave('language')}>
                            <FormattedMessage defaultMessage="Language" description="Open Language link"/>
                        </span>
                    </Link>
                </li>
            </ul>
            <div style={gapStyle} className='dashboard-footer-right-content'>
                <FormattedMessage  defaultMessage="© 2023, Amazon Web Services, Inc. or its affiliates." description="Copyright description"/>
                <ul style={gapStyle}>
                    <li>
                        <Link  data-testid="privacy-link" href="#">
                            <span style={currentFooterColor['privacy']} onMouseEnter={()=> handleMouseEnter('privacy')} onMouseLeave={()=>handleMouseLeave('privacy')}>
                                <FormattedMessage defaultMessage="Privacy" description="Open privacy link"/>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link  data-testid="terms-link" href="#">
                            <span style={currentFooterColor['terms']} onMouseEnter={()=> handleMouseEnter('terms')} onMouseLeave={()=>handleMouseLeave('terms')}>
                                <FormattedMessage defaultMessage="Terms" description="Open Terms link"/>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link  data-testid="cookie-link" href="#">
                            <span style={currentFooterColor['cookie']} onMouseEnter={()=> handleMouseEnter('cookie')} onMouseLeave={()=>handleMouseLeave('cookie')}>
                                <FormattedMessage defaultMessage="Cookie preferences" description="Open Cookie Preferences link"/>
                             </span>   
                        </Link>
                    </li>
                </ul>
            </div>
    </footer>
  );
}

