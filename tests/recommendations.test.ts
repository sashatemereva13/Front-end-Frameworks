import type { Movie } from "../src/types";
import { getRecommendations } from "../src/utils/recommendations";

function makeMovie(id: number, genre_ids: number[], popularity = 0): Movie {
  return {
    id,
    title: `Movie ${id}`,
    overview: "",
    poster_path: null,
    backdrop_path: null,
    genre_ids,
    release_date: "2024-01-01",
    vote_average: 0,
    vote_count: 0,
    popularity,
    adult: false,
  };
}

// Arrange -> Act -> Assert
describe("getRecommendations", () => {
  it("does not recommend movies that are already favorites", () => {
    const favorite = makeMovie(1, [28]);
    const candidate = makeMovie(2, [28]);

    const recommendations = getRecommendations(
      [favorite, candidate],
      [favorite],
    );

    expect(recommendations.map((item) => item.movie.id)).toEqual([2]);
  });

  if (
    ("ranks movies with more preferred genres higher",
    () => {
      const favorite = makeMovie(1, [28, 878]);
      const matchesBothGenres = makeMovie(2, [28, 878]);
      const matchesOneGenre = makeMovie(3, [28]);

      const recommendations = getRecommendations(
        [matchesOneGenre, matchesBothGenres],
        [favourite],
      );

      expect(recommendations.map((item) => item.movie.id)).toEqual([2, 3]);
    })
  );

  it("omits movies that have no matching genres", () => {
    const favorite = makeMovie(1, [28]);
    const unrelatedMovie = makeMovie(2, [35]);

    const recommendations = getRecommendations([unrelatedMovie], [favorite]);

    expect(recommendations).toEqual([]);
  });

  it("returns no recommendations when there are no favorites", () => {
    const candidate = makeMovie(2, [28]);

    const recommendations = getRecommendations([candidate], []);

    expect(recommendations).toEqual([]);
  });

  it("does not return more movies than the requested limit", () => {
    const favorite = makeMovie(1, [28]);
    const candidates = [
      makeMovie(2, [28]),
      makeMovie(3, [28]),
      makeMovie(4, [28]),
    ];

    const recommendations = getRecommendations(candidates, [favorite], 2);

    expect(recommendations).toHaveLength(2);
  });
});
