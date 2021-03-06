import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_GENRES } from '../queries';

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ALL_GENRES }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    console.log('add book...');
    console.log({ title, author, published, genres });

    addBook({ variables: { title, author, published: parseInt(published), genres } });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input required value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input required value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input required type='number' value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit' disabled={genres.length === 0}>
          create book
        </button>
      </form>
    </div>
  );
};

export default NewBook;
