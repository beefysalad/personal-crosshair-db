import { GET } from "@/app/api/stats/route";
import { calculateStorageStats } from "@/app/api/stats/service";

// Mock the service
jest.mock("@/app/api/stats/service");

describe("Stats API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns storage stats successfully", async () => {
    const mockStats = {
      totalCrosshairs: 5,
      databaseStorageBytes: 2048,
      databaseStorageKB: 2.0,
      cloudinaryStorageBytes: 5242880,
      cloudinaryStorageMB: 5.0,
      totalStorageBytes: 5244928,
      totalStorageMB: 5.002,
    };

    (calculateStorageStats as jest.Mock).mockResolvedValue(mockStats);

    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(mockStats);
    expect(calculateStorageStats).toHaveBeenCalledTimes(1);
  });

  it("handles errors and returns 500", async () => {
    (calculateStorageStats as jest.Mock).mockRejectedValue(
      new Error("Database connection failed"),
    );

    const response = await GET();

    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data).toEqual({ error: "Internal Server Error" });
  });

  it("returns correct content type", async () => {
    const mockStats = {
      totalCrosshairs: 0,
      databaseStorageBytes: 0,
      databaseStorageKB: 0,
      cloudinaryStorageBytes: 0,
      cloudinaryStorageMB: 0,
      totalStorageBytes: 0,
      totalStorageMB: 0,
    };

    (calculateStorageStats as jest.Mock).mockResolvedValue(mockStats);

    const response = await GET();

    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
