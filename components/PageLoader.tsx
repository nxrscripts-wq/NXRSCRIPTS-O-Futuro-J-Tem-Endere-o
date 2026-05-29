import React from 'react';

const PageLoader: React.FC = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-transparent">
            <div className="w-10 h-10 border-4 border-nxr-primary/20 border-t-nxr-primary rounded-full animate-spin"></div>
        </div>
    );
};

export default PageLoader;
