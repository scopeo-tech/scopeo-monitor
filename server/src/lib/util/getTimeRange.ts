const getTimeRange = (timeFilter: string) => {
    const now = new Date();
    let startTime: Date | undefined;
  
    switch (timeFilter) {
      case "today":
        startTime = new Date(now.setHours(0, 0, 0, 0)); 
        break;
      case "week":
        startTime = new Date(now.setDate(now.getDate() - 6)); 
        startTime.setHours(0, 0, 0, 0);
        break;
      case "month":
        startTime = new Date(now.setDate(now.getDate() - 29)); 
        startTime.setHours(0, 0, 0, 0);
        break;
      case "all":
        startTime = undefined;
        break;
      default:
        throw new Error("Invalid time filter");
    }
  
    return startTime ? { $gte: startTime, $lte: new Date() } : undefined;
  };

  export default getTimeRange