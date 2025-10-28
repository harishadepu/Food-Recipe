import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Recipe = () => {
  const [search, setSearch] = useState('');
  const [mealList, setMealList] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchRecipe = async () => {
    if (!search.trim()) {
      return alert('Type any recipe');
    }

    setLoading(true);
    try {
      const result = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${search.toLowerCase()}`
      );
      setMealList(result.data.meals || []);
      setSelectedMeal(null); // Clear previous selection
    } catch (err) {
      console.error('Error fetching recipes:', err.message);
      setMealList([]);
    } finally {
      setLoading(false);
    }
  };

  const getMealDetails = async (id) => {
    setLoading(true);
    try {
      const result = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      setSelectedMeal(result.data.meals[0]);
    } catch (err) {
      console.error('Error fetching meal details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setSelectedMeal(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className='text-4xl font-bold mb-8 text-center'>Recipe Search</h1>
      <div className="flex gap-4 mb-6">
        <input
          className="w-full border p-3 rounded-lg outline-none"
          type="text"
          placeholder="Search recipe by ingredient"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={searchRecipe}
          className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 w-[120px]"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-blue-500 text-center">Loading...</p>}

      {!selectedMeal && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mealList.length > 0 ? (
            mealList.map((item) => (
              <div
                key={item.idMeal}
                onClick={() => getMealDetails(item.idMeal)}
                className="cursor-pointer bg-gray-600 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={item.strMealThumb}
                  alt={item.strMeal}
                  className="w-full h-48 object-cover rounded"
                />
                <h2 className="text-lg font-semibold mt-2 text-center">{item.strMeal}</h2>
              </div>
            ))
          ) : (
            !loading && (
              <p className="col-span-3 text-center text-gray-500">
                No meals found. Try a different ingredient.
              </p>
            )
          )}
        </div>
      )}

      {selectedMeal && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-900">
          <button
            onClick={goBack}
            className="mb-4 px-4 py-2 bg-blue-500 cursor-pointer hover:bg-gray-400 rounded"
          >
            ← Back to Recipes
          </button>
          <h2 className="text-2xl font-bold mb-4">{selectedMeal.strMeal}</h2>
          <img
            src={selectedMeal.strMealThumb}
            alt={selectedMeal.strMeal}
            className="w-full max-w-md mx-auto rounded mb-4"
          />
          <h3 className="text-xl font-semibold mb-2 font-bold">Ingredients:</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            {Array.from({ length: 20 }, (_, i) => {
              const ingredient = selectedMeal[`strIngredient${i + 1}`];
              const measure = selectedMeal[`strMeasure${i + 1}`];
              return ingredient && ingredient.trim() ? (
                <li key={i}>
                  {ingredient} - {measure}
                </li>
              ) : null;
            })}
          </ul>
          <h3 className="text-xl font-semibold mb-2 font-bold">Instructions:</h3>
          <p className="whitespace-pre-line text-gray-300">{selectedMeal.strInstructions}</p>
        </div>
      )}
    </div>
  );
};

export default Recipe;