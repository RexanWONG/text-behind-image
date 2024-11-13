import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// ... other imports

const Page = () => {
    // ... existing state and refs
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedResolution, setSelectedResolution] = useState<string | null>(null);

    const handleSaveImageClick = () => {
        setIsDialogOpen(true);
    };

    const handleResolutionSelect = (resolution: string) => {
        setSelectedResolution(resolution);
        setIsDialogOpen(false);
        saveCompositeImage(resolution);
    };

    const saveCompositeImage = (resolution: string) => {
        // Implement the logic to save the image based on the selected resolution
        // For example, you can adjust the canvas size based on the resolution
        console.log(`Saving image in ${resolution} resolution`);
        // Your existing image saving logic goes here
    };

    return (
        <>
            {/* Existing JSX code */}
            <Button onClick={handleSaveImageClick}>
                Save image
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Resolution</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-2">
                        <Button onClick={() => handleResolutionSelect('720p')}>720p</Button>
                        <Button onClick={() => handleResolutionSelect('HD')}>HD</Button>
                        <Button onClick={() => handleResolutionSelect('4K')}>4K</Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Page; 