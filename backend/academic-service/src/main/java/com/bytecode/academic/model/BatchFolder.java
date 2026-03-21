package com.bytecode.academic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchFolder {
    private String name;
    private String createdBy;
    @Builder.Default
    private List<UserAccess> sharedWith = new ArrayList<>();
    @Builder.Default
    private List<BatchFile> files = new ArrayList<>();
}
