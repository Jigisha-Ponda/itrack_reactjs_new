const getStatusStyles = (status) => {
    switch (status) {
        case 'Pending':
            return { color: '#FFA500', backgroundColor: '#FFF5E5' }; // Orange
        case 'Driver Assigned':
            return { color: '#0000FF', backgroundColor: '#E5F2FF' }; // Blue
        case 'Arrival on Pickup':
            return { color: '#8A2BE2', backgroundColor: '#F3E5FF' }; // Purple
        case 'Picked Up':
            return { color: '#1E90FF', backgroundColor: '#E5F0FF' }; // Dodger Blue
        case 'Arrival on Delivery':
            return { color: '#FFD700', backgroundColor: '#FFFBE5' }; // Gold
        case 'Delivered':
            return { color: '#1F9254', backgroundColor: '#EBF9F1' }; // Green (Original)
        case 'Halt':
            return { color: '#FF4500', backgroundColor: '#FFE5E5' }; // Orange Red
        case 'Cancelled':
            return { color: '#FF0000', backgroundColor: '#FFE5E5' }; // Red  
        case 'Cancelling':
            // orange light
            return { color: '#FFA500', backgroundColor: '#FFF5E5' }; // Orange
        case 'Hold':
            // yellow light
            return { color: '#FFD700', backgroundColor: '#FFFBE5' }; // Gold
        default:
            return { color: '#000000', backgroundColor: '#FFFFFF' }; // Default Black on White
    }
};

export default getStatusStyles;