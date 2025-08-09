import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
<<<<<<< Updated upstream
=======
  const navigate = useNavigate();
  const { isTinyMobile, getResponsiveValue } = useResponsive();

  const responsiveLogoSize = getResponsiveValue({
    xl: '144px',
    lg: '120px',
    md: '100px',
    sm: '80px',
    xs: '60px',
    tiny: '40px', // Reduced from 50px for better mobile proportion
  });

  const responsivePartnerWidth = getResponsiveValue({
    xl: '50%',
    lg: '60%',
    md: '70%',
    sm: '80%',
    xs: '90%',
    tiny: '95%',
  });

  const responsivePartnerPadding = getResponsiveValue({
    xl: '22.5px',
    lg: '20px',
    md: '18px',
    sm: '16px',
    xs: '14px',
    tiny: '12px',
  });

  const responsiveSocialSize = getResponsiveValue({
    xl: '40px',
    lg: '35px',
    md: '30px',
    sm: '25px',
    xs: '20px',
    tiny: '18px',
  });

>>>>>>> Stashed changes
  return (
    <footer className='footer-section' style={{ zIndex: 60, position: 'sticky', top: '54px', background: '#000' }}>
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <img className="w-36 h-auto" src={assets.logo} alt="logo" />
                    {/* Removed lorem ipsum and download images */}
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+1-234-567-890</p>
                            <p>contact@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} ©. All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer
