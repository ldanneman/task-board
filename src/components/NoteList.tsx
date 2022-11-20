import React from "react";
import { Row, Col, Stack, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "../App";
import { SimplifiedNote } from "./NoteCard";
import NoteCard from "./NoteCard";
import EditTagsModal from "./EditTagsModal";

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const [title, setTitle] = React.useState("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = React.useState(false);

  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  const mappedSelectedTags = selectedTags.map((tag) => {
    return { label: tag.label, value: tag.id };
  });

  const mappedAvailableTags = availableTags.map((tag) => {
    return { label: tag.label, value: tag.id };
  });

  const modifyTags = (tags) => {
    setSelectedTags(
      tags.map((tag) => {
        return { label: tag.label, id: tag.value };
      })
    );
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setEditTagsModalIsOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => e.target.value}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={mappedSelectedTags}
                options={mappedAvailableTags}
                onChange={(tags) => modifyTags(tags)}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} x1={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        availableTags={availableTags}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
      />
    </>
  );
}

export default NoteList;
