import axios from "axios";
import { checkPrice } from "../services/price";

jest.mock("axios");

describe("Bitcoin Price Alert System", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should trigger alert when crossing upward threshold", async () => {
    // From $49k → $51k (crosses $50k)
    (axios.get as jest.Mock).mockResolvedValue({
      data: { bitcoin: { usd: 49000 } },
    });
    await checkPrice();
    (axios.get as jest.Mock).mockResolvedValue({
      data: { bitcoin: { usd: 51000 } },
    });

    await checkPrice();
    expect(axios.post as jest.Mock).toHaveBeenCalled();
  });
  it("should trigger alert when crossing downward threshold", async () => {
    // From $51k → $49k (crosses $50k)
    (axios.get as jest.Mock).mockResolvedValue({
      data: { bitcoin: { usd: 51000 } },
    });
    await checkPrice();
    (axios.get as jest.Mock).mockResolvedValue({
      data: { bitcoin: { usd: 49000 } },
    });

    await checkPrice();
    expect(axios.post as jest.Mock).toHaveBeenCalled();
  });
});
