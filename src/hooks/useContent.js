import { useState, useEffect } from 'react';
import * as content from '../data';

/**
 * Custom hook for loading content
 * This abstraction allows us to easily switch between:
 * - Static imports (current)
 * - API calls
 * - CMS integration
 * - Local storage
 * - GraphQL queries
 * 
 * @param {string} contentKey - The content section to load
 * @returns {object} { data, loading, error }
 */
export function useContent(contentKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        // Current implementation: static imports
        if (content[contentKey]) {
          setData(content[contentKey]);
        } else {
          throw new Error(`Content key "${contentKey}" not found`);
        }
        
        // Future implementation examples:
        
        // API call:
        // const response = await fetch(`/api/content/${contentKey}`);
        // const data = await response.json();
        // setData(data);
        
        // CMS integration:
        // const data = await cmsClient.getContent(contentKey);
        // setData(data);
        
        // GraphQL:
        // const { data } = await graphqlClient.query({
        //   query: GET_CONTENT,
        //   variables: { key: contentKey }
        // });
        // setData(data.content);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentKey]);

  return { data, loading, error };
}

/**
 * Hook for loading multiple content sections at once
 */
export function useMultiContent(contentKeys) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const loadedContent = {};
        
        for (const key of contentKeys) {
          if (content[key]) {
            loadedContent[key] = content[key];
          }
        }
        
        setData(loadedContent);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentKeys.join(',')]);

  return { data, loading, error };
}
