export const imageFileFilter = (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        req.fileValidationError = 'Only image files are allowed';
        return callback(null, false);
    }
    callback(null, true);
};