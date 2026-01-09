export const getPortfolio = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updatePortfolio = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const { holdings } = req.body; // Assuming holdings are sent in the request body
        const portfolio = await Portfolio.findOneAndUpdate(
            { userId },
            { holdings },
            { new: true }
        );
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};