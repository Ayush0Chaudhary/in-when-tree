const Navbar = () => {
  return (
    <nav className='bg-black shadow-lg w-full'>
      <div className='container mx-auto px-4 py-2 md:flex md:items-center md:justify-between'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center flex-shrink-0 text-white mr-6'>
            {/* Replace the URL with your logo image */}
            <img className='h-12 w-auto' src='/logo.png' alt='Logo' />
            {/* <span className="font-semibold text-xl ml-2">Alpex Lab</span> */}
          </div>
        </div>
        <div className='md:flex items-center'>
          <div className='md:ml-4'>
            <a
              href='https://docs.google.com/forms/d/e/1FAIpQLSc10R8len83hDExgqg9f1a0lRfa09UAVPeZXf9BBDxr2nrjhg/viewform?usp=sf_link'
              target='_blank'
              className='block mt-4 md:inline-block md:mt-0 text-white hover:text-gray-400 mr-4'
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
