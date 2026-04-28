import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  Box,
  Typography,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { CategoryModel } from "@shared/models/Category";
import { toast } from "react-hot-toast";
import { CategoryId } from "@shared/primitives";

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  onCategoriesChange?: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  open,
  onClose,
  onCategoriesChange,
}) => {
  const { apiGateway, user } = useStoreContext();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(
    null
  );
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    icon: "dots-horizontal",
    color: "#9CA3AF",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiGateway.categoryService.getCategories({
        userId: user.userId,
      });
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleEdit = (category: CategoryModel) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      icon: "dots-horizontal",
      color: "#9CA3AF",
    });
    setIsAdding(true);
  };

  const handleDelete = async (categoryId: CategoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setLoading(true);
        await apiGateway.categoryService.deleteCategory(categoryId);
        toast.success("Category deleted");
        fetchCategories();
        onCategoriesChange?.();
      } catch (err) {
        toast.error("Failed to delete category");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);
      if (editingCategory) {
        await apiGateway.categoryService.updateCategory({
          categoryId: editingCategory.id,
          name: formData.name,
          icon: formData.icon,
          color: formData.color,
          userId: user.userId,
        });
        toast.success("Category updated");
      } else {
        await apiGateway.categoryService.createCategory({
          name: formData.name,
          icon: formData.icon,
          color: formData.color,
          userId: user.userId,
        });
        toast.success("Category created");
      }
      setIsAdding(false);
      setEditingCategory(null);
      fetchCategories();
      onCategoriesChange?.();
    } catch (err) {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Manage Categories</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {isAdding || editingCategory ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Icon Name (e.g. food, car)"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Pick a Color
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  {[
                    "#F87171",
                    "#60A5FA",
                    "#FBBF24",
                    "#A78BFA",
                    "#34D399",
                    "#9CA3AF",
                    "#F472B6",
                    "#FB923C",
                  ].map((c) => (
                    <Box
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: c,
                        cursor: "pointer",
                        border:
                          formData.color === c ? "2px solid #000" : "none",
                        "&:hover": { opacity: 0.8 },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {editingCategory ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                startIcon={<PlusOutlined />}
                variant="contained"
                onClick={handleAdd}
                size="small"
              >
                Add New
              </Button>
            </Box>
            {loading && categories.length === 0 ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <ListItem
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEdit(category)}
                            disabled={category.userId === null}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDelete(category.id)}
                            disabled={category.userId === null}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: category.color,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={category.name}
                        secondary={category.userId === null ? "System Default (Read-only)" : ""}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManager;
