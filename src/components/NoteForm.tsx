import React from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreateableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";
import { MultiValue } from "react-select";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  const titleRef = React.useRef<HTMLInputElement>(null);
  const markdownRef = React.useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>(tags);
  const navigate = useNavigate();

  const mappedSelectedTags = selectedTags.map((tag) => {
    return { label: tag.label, value: tag.id };
  });

  const mappedAvailableTags = availableTags.map((tag) => {
    return { label: tag.label, value: tag.id };
  });

  const modifyTags = (
    tags: Tag[] | MultiValue<{ label: string; value: string }>
  ) => {
    console.log("TAGS", typeof tags);
    setSelectedTags(
      tags.map((tag) => {
        return { label: tag.label, id: tag.value };
      })
    );
  };

  const handleCreateNewTag = (label: string) => {
    const newTag = { id: uuidV4(), label };
    onAddTag(newTag);
    setSelectedTags((prev) => [...prev, newTag]);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });
    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreateableReactSelect
                onCreateOption={(label) => handleCreateNewTag(label)}
                value={mappedSelectedTags}
                options={mappedAvailableTags}
                onChange={(tags) => modifyTags(tags)}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={markdown}
            required
            as="textarea"
            ref={markdownRef}
            rows={15}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}

export default NoteForm;
