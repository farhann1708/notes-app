import { animate } from 'motion';

const baseUrl = 'https://notes-api.dicoding.dev/v2';

const createNote = async (title, body) => {
  const requestData = {
    title: title,
    body: body,
  };

  try {
    const response = await fetch(`${baseUrl}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create note');
    }

    return responseData;
  } catch (error) {
    showResponseMessage(error.message || 'Failed to create note');
  }
};

const showResponseMessage = (message = 'Check your internet connection') => {
  alert(message);
};

const handleFetchErrors = (response) => {
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

const getNonArchivedNotes = async () => {
  try {
    const response = await fetch(`${baseUrl}/notes`);
    const notes = await handleFetchErrors(response);

    if (notes.status === 'success') {
      return notes.data.filter((note) => !note.archived);
    } else {
      throw new Error(notes.message || 'Failed to fetch notes');
    }
  } catch (error) {
    showResponseMessage(error.message || 'Failed to fetch notes');
  }
};

const getArchivedNotes = async () => {
  try {
    const response = await fetch(`${baseUrl}/notes/archived`);
    const notes = await response.json();

    if (notes.status === 'success') {
      return notes.data;
    } else {
      throw new Error(notes.message);
    }
  } catch (error) {
    showResponseMessage(error.message);
  }
};

const getSingleNote = async (noteId) => {
  try {
    const response = await fetch(`${baseUrl}/notes/${noteId}`);
    const note = await response.json();

    if (note.status === 'success') {
      return note.data;
    } else {
      throw new Error(note.message);
    }
  } catch (error) {
    showResponseMessage(error.message);
  }
};

const archiveNote = async (noteId) => {
  try {
    const response = await fetch(`${baseUrl}/notes/${noteId}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 'success') {
      animate('.button-archive', { scale: 1.3 });
      return data.message;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    showResponseMessage(error.message);
  }
};

const unarchiveNote = async (noteId) => {
  try {
    const response = await fetch(`${baseUrl}/notes/${noteId}/unarchive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 'success') {
      animate('.button-archive', { scale: 1.3 });
      return data.message;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    showResponseMessage(error.message);
  }
};

const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`${baseUrl}/notes/${noteId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.status === 'success') {
      animate('.button-delete', { scale: 1.3 });
      return data.message;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    showResponseMessage(error.message);
  }
};

const renderNoteCard = (note) => {
  const archiveClass = note.archived ? 'btn-warning' : 'btn-success';
  const archiveAction = note.archived ? 'Unarchive' : 'Archive';

  return `
    <div class="col-lg-12 mb-2">
      <div class="card">
        <div class="card-body">
          <h2>${note.title}</h2>
          <p>${note.body}</p>
          <div class="d-flex justify-content-between mb-2">
            <small>${new Date(note.createdAt).toLocaleString()}</small>
            </div>
            <div>
            <button type="button" class="btn btn-sm btn-danger button-delete" data-id="${note.id}">Delete</button>
            <button type="button" class="btn btn-sm ${archiveClass} button-archive" data-id="${note.id}" data-archived="${note.archived ? 'true' : 'false'}">${archiveAction}</button>
            </div>
        </div>
      </div>
    </div>`;
};

const addDeleteButtonListeners = () => {
  const buttons = document.querySelectorAll('.button-delete');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const noteId = event.target.getAttribute('data-id');
      await deleteNote(noteId);
      await renderAllNotes();
    });
  });
};

const addArchiveButtonListeners = () => {
  const buttons = document.querySelectorAll('.button-archive');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const noteId = event.target.getAttribute('data-id');
      const isArchived = event.target.getAttribute('data-archived') === 'true';
      if (isArchived) {
        await unarchiveNote(noteId);
      } else {
        await archiveNote(noteId);
      }
      await renderAllNotes();
    });
  });
};

const renderAllNotes = async (searchText = '') => {
  try {
    const nonArchivedNotes = await getNonArchivedNotes();
    const archivedNotes = await getArchivedNotes();

    const listNoteElement = document.querySelector('#listNote');
    const listArchiveElement = document.querySelector('#listArchive');
    listNoteElement.innerHTML = '';
    listArchiveElement.innerHTML = '';

    const filteredNonArchivedNotes = nonArchivedNotes.filter((note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()),
    );

    filteredNonArchivedNotes.forEach((note) => {
      listNoteElement.innerHTML += renderNoteCard(note);
    });

    archivedNotes.forEach((note) => {
      listArchiveElement.innerHTML += renderNoteCard(note);
    });

    addDeleteButtonListeners();
    addArchiveButtonListeners(); 
  } catch (error) {
    showResponseMessage(error.message);
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.classList.add('d-none');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const addNoteForm = document.getElementById('addNoteForm');
  addNoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inputTitle = document.getElementById('inputTitle').value;
    const inputBody = document.getElementById('inputBody').value;

    if (!inputTitle.trim() || !inputBody.trim()) {
      const titleInput = document.getElementById('inputTitle');
      const bodyInput = document.getElementById('inputBody');
      titleInput.classList.add('is-invalid');
      bodyInput.classList.add('is-invalid');
      return;
    }

    try {
      await createNote(inputTitle, inputBody);
      document.getElementById('inputTitle').value = '';
      document.getElementById('inputBody').value = '';

      document.getElementById('inputTitle').classList.remove('is-invalid');
      document.getElementById('inputBody').classList.remove('is-invalid');

      await renderAllNotes();
    } catch (error) {
      showResponseMessage(error.message);
    }
  });

  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchText = document.getElementById('searchInput').value;
    await renderAllNotes(searchText);
  });

  renderAllNotes();
});
