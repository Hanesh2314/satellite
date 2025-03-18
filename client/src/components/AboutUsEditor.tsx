import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AboutUsContent {
  id: string;
  content: string;
}

interface AboutUsEditorProps {
  isAdmin?: boolean;
}

const AboutUsEditor = ({ isAdmin = false }: AboutUsEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aboutUsData, isLoading } = useQuery<AboutUsContent>({
    queryKey: ['/api/about-us'],
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: async (newContent: string) => {
      return apiRequest('/api/about-us', {
        method: 'POST',
        body: JSON.stringify({
          content: newContent
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/about-us'] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "About Us content updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating About Us content:", error);
    },
  });

  useEffect(() => {
    if (aboutUsData) {
      setEditedContent(aboutUsData.content);
    }
  }, [aboutUsData]);

  const handleSave = useCallback(() => {
    updateMutation.mutate(editedContent);
  }, [editedContent, updateMutation]);

  const handleCancel = useCallback(() => {
    if (aboutUsData) {
      setEditedContent(aboutUsData.content);
    }
    setIsEditing(false);
  }, [aboutUsData]);

  const defaultContent = "We are a team of passionate scientists, engineers, and space enthusiasts dedicated to advancing satellite technology. Our mission is to design, build, and operate cutting-edge satellite systems that contribute to scientific discovery, Earth observation, and space exploration.";

  if (isLoading) {
    return (
      <Card className="bg-deep-blue bg-opacity-80 border border-satellite-blue">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-stellar-yellow flex justify-between items-center">
            About Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-20 bg-space-black rounded" />
        </CardContent>
      </Card>
    );
  }

  const content = aboutUsData?.content || defaultContent;

  return (
    <Card className="bg-deep-blue bg-opacity-80 border border-satellite-blue">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-stellar-yellow flex justify-between items-center">
          About Us
          {!isEditing && isAdmin && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[150px] bg-space-black text-white border-satellite-blue"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                className="text-white border-satellite-blue"
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                className="bg-stellar-yellow text-space-black hover:bg-yellow-400"
                disabled={updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" /> 
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="text-white whitespace-pre-line">{content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutUsEditor;