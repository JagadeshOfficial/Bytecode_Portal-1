package com.bytecode.academic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchFile {
    private String name;
    private String url;
    private String type;
    private String size;
    private String uploadedBy;
    @Builder.Default
    private List<UserAccess> sharedWith = new ArrayList<>();
    private Date uploadDate;
}
